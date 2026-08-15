<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CmsAuditService;

class CmsAuditController extends Controller
{
    public function show(CmsAuditService $audit)
    {
        return response()->json($audit->report());
    }
}
